import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ReactNode } from 'react';

interface ModalPropsType {
  children: ReactNode;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ModalComponent(props: ModalPropsType) {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[825px] max-h-[800px] overflow-auto max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">{props.children}</div>
      </DialogContent>
    </Dialog>
  );
}
