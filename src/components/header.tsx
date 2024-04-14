export function Header({
  title,
  description,
}: { title: string; description?: string }) {
  return (
    <div className='flex flex-col gap-1'>
      <h1 className='text-3xl font-black'>{title}</h1>
      {description && (
        <h2 className='max-sm:text-sm text-default-500'>{description}</h2>
      )}
    </div>
  );
}
