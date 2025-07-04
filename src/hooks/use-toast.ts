import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

type State = {
  toasts: ToasterToast[]
}

type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string }

let count = 0
const genId = () => (count = (count + 1) % Number.MAX_SAFE_INTEGER).toString()

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: "REMOVE_TOAST", toastId })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(t => 
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      }

    case "DISMISS_TOAST": {
      const { toastId } = action
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach(toast => addToRemoveQueue(toast.id))
      }

      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        )
      }
    }

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: action.toastId === undefined
          ? []
          : state.toasts.filter(t => t.id !== action.toastId)
      }
  }
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

const dispatch = (action: Action) => {
  memoryState = reducer(memoryState, action)
  listeners.forEach(listener => listener(memoryState))
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast: (props: Omit<ToasterToast, "id">) => {
      const id = genId()
      dispatch({
        type: "ADD_TOAST",
        toast: { ...props, id }
      })
      return id
    },
    dismiss: (toastId?: string) => {
      dispatch({ type: "DISMISS_TOAST", toastId })
    },
    update: (toast: Partial<ToasterToast>) => {
      dispatch({ type: "UPDATE_TOAST", toast })
    }
  }
}
