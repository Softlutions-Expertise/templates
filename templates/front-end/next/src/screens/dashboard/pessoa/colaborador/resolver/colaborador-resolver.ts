import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { IColaborador, IColaboradorCreateUpdate } from '@/models';
import { colaboradorDefaultValues } from './colaborador-default-values';
import { colaboradorValidationSchema } from './colaborador-validation-schema';

// ----------------------------------------------------------------------

export const colaboradorResolver = (currentData?: IColaborador | null, isEdit: boolean = false) => {
  return useForm<IColaboradorCreateUpdate>({
    resolver: yupResolver(colaboradorValidationSchema) as any,
    defaultValues: colaboradorDefaultValues(currentData) as any,
    context: { isEdit },
    mode: 'all',
  });
};
