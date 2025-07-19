'use client'

interface Props {
  error: Error,
  reset: () => void
}

const ErrorPage:React.FC<Props> = ({ error, reset }: Props) => {
    console.log('Error',error);
    reset();
  return (
    <>
        <div>An unexpected error has occurred</div>
        <button className='btn' onClick={() => reset()}>Retry</button>
    </>
  )
}

export default ErrorPage