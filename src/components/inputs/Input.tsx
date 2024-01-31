'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface InputProps {
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
  placeholder?: string;
  iconsrc?: string;
  iconAlt?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  iconsrc,
  iconAlt,
  placeholder,
  register,
  required,
  errors,
  type = 'text',
  disabled,
}) => {
  return (
    <div className='relative mt-2'>
      {iconsrc && (
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
          {/* Next.js의 Image 컴포넌트 사용. 필요에 따라 크기 조정 */}
          <Image src={iconsrc} alt={iconAlt} width={15} height={15} />
        </div>
      )}
      <input
        id={id}
        type={type}
        autoComplete={id}
        disabled={disabled}
        placeholder={placeholder}
        {...register(id, { required })}
        className={clsx(
          'form-input block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 pl-10',
          errors[id] && 'focus:ring-green-500',
          disabled && 'opacity-50 cursor-default'
        )}
      />
    </div>
  );
};

export default Input;
