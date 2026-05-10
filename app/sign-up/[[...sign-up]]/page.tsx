import { SignUp } from '@clerk/nextjs'
import Logo from '@/components/logo'

export default function Page() {
  return   <div className='bg-muted flex w-full flex-1 items-center justify-center p-6 md:p-10 flex-col gap-4'>
    <Logo src={"/logo.png"} />
        <SignUp />
      </div>
}