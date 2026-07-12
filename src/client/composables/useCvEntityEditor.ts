/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, onBeforeMount, ref } from 'vue'
import { useKeyboard } from '~/client/composables/useKeyboard'
import { useProfiles } from '~/client/composables/useProfiles'
import { useToast } from '~/client/composables/useToast'

export interface CvEditableEntity {
  id: string
  profileId: string
  order: number
}

export interface EntityOrderItem {
  id: string
  order: number
  label?: string
}

export interface EntityFieldState<TValue> {
  oldValue: TValue
  newValue: TValue
  focused: boolean
  loading: boolean
}

export type EntityEditForm<
  TEntity,
  TEditableKey extends keyof TEntity,
> = {
    [K in TEditableKey]: EntityFieldState<TEntity[K]>
  }

export type EntityPatchBody<
  TEntity,
  TEditableKey extends keyof TEntity,
> = Partial<Pick<TEntity, TEditableKey>>

export interface CvEntityEditorApi<
  TEntity extends CvEditableEntity,
  TEditableKey extends keyof TEntity,
> {
  getListByProfileId(profileId: string): Promise<TEntity[]>

  patch(
    id: string,
    body: EntityPatchBody<TEntity, TEditableKey>,
  ): Promise<TEntity | boolean | null>

  reorder(
    profileId: string,
    items: EntityOrderItem[],
  ): Promise<boolean>
}

export interface UseCvEntityEditorOptions<
  TEntity extends CvEditableEntity,
  TEditableKey extends keyof TEntity,
> {
  editableFields: readonly TEditableKey[]

  api: CvEntityEditorApi<TEntity, TEditableKey>

  getLabel?: (entity: TEntity) => string

  createPageUrl?: string

  messages?: {
    updated?: string
    updateError?: string
    reorderError?: string
  }
}

/**
 * Универсальный composable для управления редактируемыми CV-сущностями
 * в административной панели.
 *
 * Инкапсулирует загрузку сущностей по CV-профилю, выбор элемента,
 * редактирование отдельных полей, массовое сохранение изменений,
 * отмену изменений и управление порядком элементов.
 *
 * Конкретная сущность передаёт composable собственный API-адаптер,
 * список редактируемых полей, функцию получения отображаемого названия
 * и URL страницы создания.
 *
 * Composable не зависит от Links, Experience, Projects или других
 * конкретных сущностей и возвращает единый интерфейс управления редактором.
 */
export function useCvEntityEditor<
  TEntity extends CvEditableEntity,
  TEditableKey extends keyof TEntity,
>(
  options: UseCvEntityEditorOptions<TEntity, TEditableKey>,
) {
  const toast = useToast()

  const {
    profiles,
    selectedProfileId,
  } = useProfiles({ setFirstAsSelect: true }, () => {
    loadEntities({ resetSelection: true })
  })

  const entities = ref<TEntity[]>([])
  const selectedEntity = ref<TEntity | null>(null)

  const entityOrder = ref<EntityOrderItem[]>([])

  const editFormData = ref<
    Partial<EntityEditForm<TEntity, TEditableKey>>
  >({})

  const isLoading = ref(false)
  const isSaveReorderLoading = ref(false)
  const isSubmitFormChangesLoading = ref(false)

  const entitiesByProfileId = computed(() => {
    if (!selectedProfileId.value) {
      return entities.value
    }

    return entities.value.filter(
      entity => entity.profileId === selectedProfileId.value,
    )
  })

  const entitiesAreReordered = computed(() => {
    if (entityOrder.value.length !== entities.value.length) {
      return false
    }

    return entityOrder.value.some((item) => {
      const sourceEntity = entities.value.find(
        entity => entity.id === item.id,
      )

      return sourceEntity?.order !== item.order
    })
  })

  const someChange = computed(() => {
    return Object.values(editFormData.value).some((field) => {
      const f = field as any
      return f?.newValue !== f?.oldValue
    })
  })

  function getEntityLabel(entity: TEntity): string {
    return options.getLabel?.(entity) ?? entity.id
  }

  function createFieldState<TKey extends TEditableKey>(
    entity: TEntity,
    field: TKey,
  ): EntityFieldState<TEntity[TKey]> {
    return {
      oldValue: entity[field],
      newValue: entity[field],
      focused: false,
      loading: false,
    }
  }

  function selectEntity(entity: TEntity) {
    selectedEntity.value = entity

    const form = {} as EntityEditForm<TEntity, TEditableKey>

    for (const field of options.editableFields) {
      form[field] = createFieldState(entity, field)
    }

    editFormData.value = form
  }

  function resetSelection() {
    selectedEntity.value = null
    editFormData.value = {}
    resetChangesOrder()
  }

  function getFieldState<TKey extends TEditableKey>(field: TKey) {
    return editFormData.value[field]
  }

  function hasChanges<TKey extends TEditableKey>(field: TKey): boolean {
    const state = getFieldState(field)

    if (!state) {
      return false
    }

    return state.newValue !== state.oldValue
  }

  function setFieldFocus<TKey extends TEditableKey>(
    field: TKey,
    focused: boolean,
  ) {
    console.debug(editFormData.value[field])
    editFormData.value[field].focus = focused
    editFormData.value[field].focused = focused
  }

  function undoChanges<TKey extends TEditableKey>(field: TKey) {
    const state = getFieldState(field)

    if (!state) {
      return
    }

    state.newValue = state.oldValue
    state.focused = false
  }

  function resetFormChanges() {
    for (const field of options.editableFields) {
      undoChanges(field)
    }
  }

  function refreshSource(
    body: EntityPatchBody<TEntity, TEditableKey>,
  ) {
    const selectedId = selectedEntity.value?.id

    if (!selectedId) {
      return
    }

    entities.value = entities.value.map((entity) => {
      if (entity.id !== selectedId) {
        return entity
      }

      return {
        ...entity,
        ...body,
      }
    }) as TEntity[]
  }

  async function confirmUpdateField<TKey extends TEditableKey>(
    field: TKey,
  ) {
    const entity = selectedEntity.value
    const state = getFieldState(field)

    if (!entity || !state || !hasChanges(field)) {
      return
    }

    try {
      state.loading = true

      const body = {
        [field]: state.newValue,
      } as EntityPatchBody<TEntity, TEditableKey>

      const result = await options.api.patch(entity.id, body)

      if (!result) {
        throw new Error('Entity update failed')
      }

      refreshSource(body)

      state.oldValue = state.newValue
      state.focused = false

      toast.success(
        options.messages?.updated ?? 'Данные изменены',
        {
          duration: 3000,
          title: 'Success!',
        },
      )
    } catch (error) {
      console.error(error)

      toast.error(
        options.messages?.updateError ??
        'Произошла ошибка при обновлении поля',
        {
          duration: 3000,
          title: 'Ошибка',
        },
      )
    } finally {
      state.loading = false
    }
  }

  function collectChanges(): EntityPatchBody<
    TEntity,
    TEditableKey
  > {
    const body: EntityPatchBody<TEntity, TEditableKey> = {}

    for (const field of options.editableFields) {
      const state = getFieldState(field)

      if (state && hasChanges(field)) {
        body[field] = state.newValue
      }
    }

    return body
  }

  async function submitFormChanges() {
    const entity = selectedEntity.value

    if (!entity || !someChange.value) {
      return
    }

    try {
      isSubmitFormChangesLoading.value = true

      const body = collectChanges()
      const result = await options.api.patch(entity.id, body)

      if (!result) {
        throw new Error('Entity update failed')
      }

      refreshSource(body)
      selectEntity({
        ...entity,
        ...body,
      })

      toast.success(
        options.messages?.updated ?? 'Данные изменены',
        {
          duration: 3000,
          title: 'Success!',
        },
      )
    } catch (error) {
      console.error(error)

      toast.error(
        options.messages?.updateError ??
        'Произошла ошибка при изменении данных',
        {
          duration: 3000,
          title: 'Ошибка',
        },
      )
    } finally {
      isSubmitFormChangesLoading.value = false
    }
  }

  function rebuildEntityOrder() {
    entityOrder.value = entities.value.map((entity, index) => ({
      id: entity.id,
      order: index + 1,
      label: getEntityLabel(entity as TEntity),
    }))
  }

  function moveEntity(direction: 'up' | 'down') {
    const selectedId = selectedEntity.value?.id

    if (!selectedId) {
      return
    }

    const currentIndex = entities.value.findIndex(
      entity => entity.id === selectedId,
    )

    if (currentIndex === -1) {
      return
    }

    const targetIndex =
      direction === 'up'
        ? currentIndex - 1
        : currentIndex + 1

    if (
      targetIndex < 0 ||
      targetIndex >= entities.value.length
    ) {
      return
    }

    const reordered = [...entities.value]

      ;[reordered[currentIndex], reordered[targetIndex]] = [
        reordered[targetIndex],
        reordered[currentIndex],
      ]

    entities.value = reordered
    rebuildEntityOrder()
  }

  function resetChangesOrder() {
    entities.value = [...entities.value].sort(
      (a, b) => a.order - b.order,
    )

    entityOrder.value = entities.value.map(entity => ({
      id: entity.id,
      order: entity.order,
      label: getEntityLabel(entity as TEntity),
    }))
  }

  async function saveNewOrder() {
    if (!selectedProfileId.value) {
      return
    }

    try {
      isSaveReorderLoading.value = true

      const success = await options.api.reorder(
        selectedProfileId.value,
        entityOrder.value,
      )

      if (!success) {
        throw new Error('Entity reorder failed')
      }

      await loadEntities()
    } catch (error) {
      console.error(error)

      toast.error(
        options.messages?.reorderError ??
        'Произошла ошибка при изменении порядка',
        {
          duration: 3000,
          title: 'Ошибка',
        },
      )
    } finally {
      isSaveReorderLoading.value = false
    }
  }

  async function loadEntities(
    loadOptions: { resetSelection?: boolean } = {},
  ) {
    if (loadOptions.resetSelection) {
      resetSelection()
    }

    if (!selectedProfileId.value) {
      entities.value = []
      entityOrder.value = []
      return
    }

    try {
      isLoading.value = true

      entities.value = await options.api.getListByProfileId(
        selectedProfileId.value,
      )

      resetChangesOrder()
    } finally {
      isLoading.value = false
    }
  }

  function goToCreatePage() {
    if (!options.createPageUrl) {
      return
    }

    window.location.href = options.createPageUrl
  }

  useKeyboard({
    esc: resetSelection,
  })

  onBeforeMount(async () => {
    await loadEntities({ resetSelection: true })
  })

  return {
    profiles,
    selectedProfileId,

    entities,
    entitiesByProfileId,
    selectedEntity,
    entityOrder,
    editFormData,

    isLoading,
    isSaveReorderLoading,
    isSubmitFormChangesLoading,

    entitiesAreReordered,
    someChange,

    selectEntity,
    resetSelection,

    getFieldState,
    hasChanges,
    setFieldFocus,
    undoChanges,
    resetFormChanges,

    confirmUpdateField,
    submitFormChanges,

    moveEntity,
    saveNewOrder,
    resetChangesOrder,

    loadEntities,
    goToCreatePage,
  }
}
