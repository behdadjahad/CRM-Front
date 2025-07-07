import { useDraggable } from "@dnd-kit/core";

export default function DragWrapper({
  id,
  disabled,
  dragData,
  children,
}: {
  id: string;
  disabled?: boolean;
  dragData: () => any;
  children: (params: {
    setRef: (node: HTMLElement | null) => void;
    attributes: any;
    listeners: any;
    isDragging: boolean;
  }) => JSX.Element;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id,
    disabled,
    data: dragData,
  });

  return children({
    setRef: setNodeRef,
    attributes,
    listeners,
    isDragging,
  });
}