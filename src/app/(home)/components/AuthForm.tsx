'use client';

import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import Input from '@/components/inputs/Input';
import AuthSocialButton from './AuthSocialButton';
import Button from '@/components/Button';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

import personIcon from '@/public/personIcon.svg';
import emailIcon from '@/public/envelopeIcon.svg';
import lockIcon from '@/public/lockIcon.svg';

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === 'authenticated') {
      // 세션 상태가 authentication 이면 임시주소 webIDE로 보내줌
      router.push('/webIDE');
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === 'REGISTER') {
      axios
        // 임시 엔드포인트로 회원가입 데이터 post요청보냄
        .post('/api/register', data)
        .then(() =>
          signIn('credentials', {
            ...data,
            redirect: false,
          })
        )
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials!');
          }

          if (callback?.ok) {
            // callback 속성이 ok이면 webIDE로 라우터 (임시주소)
            router.push('/webIDE');
          }
        })
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => setIsLoading(false));
    }

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials!');
          }

          if (callback?.ok) {
            router.push('/webIDE');
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/webIDE');
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
      <div className='px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10'>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              iconsrc={personIcon}
              iconAlt='personIcon'
              disabled={isLoading}
              register={register}
              errors={errors}
              placeholder='name'
              required
              id='name'
            />
          )}
          <Input
            iconsrc={emailIcon}
            iconAlt='emailIcon'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            placeholder='email'
            id='email'
            type='email'
          />
          <Input
            iconsrc={lockIcon}
            iconAlt='lockIcon'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            placeholder='Password'
            id='password'
            type='password'
          />
          <div>
            <Button disabled={isLoading} fullWidth type='submit'>
              {variant === 'LOGIN' ? '로그인' : '회원가입'}
            </Button>
          </div>
          <div className='relative flex justify-between'>
            <div>
              <input type='checkbox' />
              <span className='pl-2 text-gray-500 text-sm'>
                로그인 상태 유지
              </span>
            </div>
            {/* 비밀번호 찾기 페이지 link */}
            <Link href='/' className='border-b text-gray-500 text-sm'>
              비밀번호 찾기
            </Link>
          </div>
        </form>

        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center '>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 text-gray-500 bg-white'>소셜 로그인</span>
            </div>
          </div>

          <div className='flex gap-2 mt-6'>
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>
        <div className='flex justify-center gap-2 px-2 mt-6 text-sm text-gray-500 '>
          <div>
            {variant === 'LOGIN'
              ? 'Web IDE를 처음 사용하시나요?'
              : '이미 계정이 있나요?'}
          </div>
          <div onClick={toggleVariant} className='underline cursor-pointer'>
            {variant === 'LOGIN' ? '계정 만들기' : '로그인하기'}
          </div>
        </div>
      </div>

      {/* 임시 페이지 접근 link */}
      <Link href='/MainPage'>임시페이지접근</Link>
    </div>
  );
};

export default AuthForm;
