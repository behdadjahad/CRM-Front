import { useDroppable } from "@dnd-kit/core";

export default function DropWrapper({
  id,
  acceptFrom,
  children,
}: {
  id: string;
  acceptFrom: string[];
  children: (params: {
    setRef: (node: HTMLElement | null) => void;
    isOver: boolean;
  }) => JSX.Element;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { acceptFrom },
  });

  return children({
    setRef: setNodeRef,
    isOver,
  });
}
