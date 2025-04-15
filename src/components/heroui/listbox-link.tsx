import { Link, type LinkProps } from '@heroui/link';

export function LinkForListbox({ ref, ...props }: LinkProps & { textValue: string | undefined }) {
  const { textValue, ...otherProps } = props;
  return <Link {...otherProps} ref={ref} />;
}
