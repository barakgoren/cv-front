import { ButtonProps } from "@/components/ui/button"
import MinObject from "./min-object.type"

type Action<T extends MinObject = MinObject> = {
  label?: string
  icon?: React.ReactNode
  color?: ButtonProps['color']
  variant?: ButtonProps['variant']
  onClick: (item: T) => void
}
export default Action
