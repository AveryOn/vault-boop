import { computed, reactive, ref } from 'vue'
import z from 'zod'

/**
 * Карта ошибок формы.
 * Создает объект, где каждый ключ соответствует ключу формы,
 * а значением всегда является строка с текстом ошибки.
 * @template TForm - Тип объекта формы.
 * @example
 * type Form = {
 *   name: string
 *   email: string
 * }
 * type Errors = FormErrors<Form>
 * // {
 * //   name: string
 * //   email: string
 * // }
 */
export type FormErrors<TForm extends object> = {
  [K in keyof TForm]: string
}

/**
 * Упрощенная структура ошибки валидации,
 * совместимая с результатом Zod `error.format()`.
 * Используется для преобразования ошибок Zod в карту ошибок формы.
 * @template TForm - Тип объекта формы.
 */
export interface ZodErrorCustomDetails<TForm extends object> {
  /**
   * Общие ошибки формы, которые не относятся к конкретному полю.
   * Например, ошибка всей формы или ошибка бизнес-правила.
   */
  errors: string[]

  /**
   * Ошибки конкретных полей формы.
   * Ключи объекта соответствуют ключам формы.
   * Для каждого поля хранится массив ошибок.
   */
  properties?: {
    [K in keyof TForm]?: {
      /**
       * Список ошибок для конкретного поля формы.
       * Обычно в UI используется первая ошибка из массива.
       */
      errors: string[]
    }
  }
}

/**
 * Composable для управления ошибками формы.
 * На основе переданного объекта формы создает реактивную карту ошибок,
 * где каждому полю формы соответствует строка ошибки.
 * Изначально все ошибки заполняются пустой строкой.
 * @template TForm - Тип объекта формы.
 * @param form - Объект формы, на основе ключей которого создается карта ошибок.
 * @returns Объект с реактивной картой ошибок и методом установки ошибок.
 * @example
 * const form = reactive({
 *   name: '',
 *   email: '',
 * })
 *
 * const { errors, setErrors } = useFormValidator(form)
 *
 * errors.name
 * errors.email
 *
 * setErrors({
 *   errors: [],
 *   properties: {
 *     email: {
 *       errors: ['Некорректный email'],
 *     },
 *   },
 * })
 */
export function useFormValidator<TForm extends object>(form: TForm) {
  const isSubmitLoading = ref(false)
  const isSubmitDisabled = ref(false)
  /**
   * Реактивная карта ошибок формы.
   * Ключи объекта соответствуют ключам переданной формы.
   * Значение каждого ключа — текст ошибки.
   * Пустая строка означает, что ошибки для поля нет.
   */
  const errors = reactive({} as FormErrors<TForm>) as FormErrors<TForm>

  /**
   * Инициализирует карту ошибок.
   * Для каждого поля формы создает ключ в объекте `errors`
   * и записывает туда пустую строку.
   */
  for (const key of Object.keys({ ...form }) as Array<keyof TForm>) {
    errors[key] = ''
  }

  /**
   * Заполняет карту ошибок на основе объекта ошибок Zod.
   * Метод проходит по всем существующим ключам `errors`
   * и записывает первую ошибку для каждого поля.
   * Если для поля ошибки нет, записывается пустая строка.
   * @param details - Объект с ошибками валидации.
   * @example
   * setErrors({
   *   errors: [],
   *   properties: {
   *     email: {
   *       errors: ['Некорректный email'],
   *     },
   *   },
   * })
   */
  function setErrors(details: ZodErrorCustomDetails<TForm>) {
    Object.keys(errors).forEach((k) => {
      const key = k as keyof typeof errors

      errors[key] = details.properties?.[key]?.errors[0] ?? ''
    })
  }

  /** Отменяет ошибку для определенного поля
   * @param field - Имя ключа для которого будет отменена ошибка */
  function undoError(field: keyof TForm) {
    errors[field] = ''
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function validateFormOrThrow<T extends Record<string, any>>(
    dto: z.ZodObject<T>,
    form: TForm,
    error?: (errDetails: object) => void,

  ) {
    const data = dto.safeParse(form)

    if (!data.success) {
      const details = z.treeifyError(data.error) as ZodErrorCustomDetails<TForm>
      setErrors(details)
      console.debug(details, data.error)
      error?.(details)
      throw new Error('INVALID DATA')
    }

    return data
  }

  const isSomeError = computed(() => {
    return Object.values(errors).some(Boolean)
  })
  return {
    isSubmitLoading,
    isSubmitDisabled,
    errors,
    isSomeError,
    setErrors,
    undoError,
    validateFormOrThrow,
  }
}
