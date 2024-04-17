import { useEffect } from 'react';

export const useFormGuard = (isDirty: boolean) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        isDirty &&
        event.target instanceof Element &&
        event.target.closest('a:not([target="_blank"]')
      ) {
        if (
          !window.confirm(
            '保存していない変更があります。ページを離れてもよろしいですか？',
          )
        ) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        return (event.returnValue = '');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('click', handleClick, true);
    };
  }, [isDirty]);
};
