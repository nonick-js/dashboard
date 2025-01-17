interface LogoProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  width?: number;
  height?: number;
}

export function Logo({ width, height, ...props }: LogoProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 118.06 17.526'
      {...props}
    >
      <title>NoNICK.js</title>
      <g strokeWidth={0.265}>
        <g className='fill-black dark:fill-white'>
          <path d='m5.283.28 5.893 8.026V.279h5.13v16.942H11.38L5.131 8.636v8.585H0V.28zM24.994 17.526q-2.108 0-3.683-.863-1.55-.89-2.388-2.362-.812-1.499-.812-3.226t.812-3.2q.839-1.474 2.388-2.337 1.575-.89 3.683-.89t3.683.89q1.575.863 2.388 2.336.838 1.474.838 3.2t-.838 3.227q-.813 1.473-2.388 2.362-1.575.863-3.683.863zm0-4.038q1.041 0 1.626-.66.584-.686.584-1.753 0-1.042-.584-1.702-.585-.686-1.626-.686-1.016 0-1.6.686-.584.66-.584 1.702 0 1.067.584 1.752.584.66 1.6.66zM38.989.28l5.893 8.026V.279h5.13v16.942h-4.927l-6.248-8.585v8.585h-5.131V.28zM57.887.28V17.22h-5.232V.28zM69.034 17.526q-2.642 0-4.775-1.092-2.108-1.117-3.328-3.099-1.219-2.006-1.219-4.572v-.177q.051-2.515 1.27-4.47t3.328-3.023Q66.418 0 69.034 0q3.048 0 4.902 1.423 1.88 1.422 2.794 3.505l-4.42 2.057q-.33-1.016-1.244-1.727-.914-.736-2.032-.736-1.168 0-2.108.558-.915.534-1.448 1.474-.533.914-.559 2.057v.152q0 1.169.508 2.16.534.965 1.473 1.523t2.134.56q1.118 0 2.032-.712.914-.737 1.245-1.753l4.42 2.032q-.89 2.058-2.795 3.506-1.88 1.447-4.902 1.447zM83.464.28v6.35L87.909.28h6.274l-6.401 7.873 6.68 9.068h-6.248l-3.81-5.969-.94 1.27v4.7h-5.13V.278z' />
        </g>
        <g fill='#0072f5'>
          <path d='M95.484 15.628q0-.762.406-1.168t1.152-.406q.745 0 1.134.406.407.406.407 1.168 0 .762-.407 1.169-.39.406-1.134.406-.745 0-1.152-.406t-.406-1.169zM102.594 17.186q-1.964 0-3.15-.914l1.389-2.608q.745.508 1.456.508.559 0 .898-.338.355-.339.355-.932V5.69h3.42v7.264q0 2.117-1.168 3.184-1.168 1.05-3.2 1.05zM115.954 9.515q-.711-.541-1.609-.83-.88-.287-1.71-.287-.864 0-.864.508 0 .237.373.372.39.119 1.304.305l.576.119q1.066.22 1.88.558.829.322 1.37.898.78.83.78 2.1 0 1.862-1.304 2.895-1.287 1.033-3.573 1.033-3.251 0-5.25-1.795l1.779-2.54q.677.66 1.608 1.067.949.39 2.032.39.542 0 .898-.153.355-.152.355-.457 0-.237-.372-.356-.356-.118-1.236-.288-1.355-.237-2.303-.541-.948-.322-1.677-1.101-.71-.78-.71-2.15 0-.983.541-1.83.542-.863 1.592-1.388 1.067-.525 2.557-.525 1.388 0 2.607.407 1.22.389 2.185 1.168z' />
        </g>
      </g>
    </svg>
  );
}
