'use client';

import { Iconify, Tabs } from '@/components';
import { RHFDatePicker } from '@/components/hook-form';
import { IColaborador, IColaboradorCreateUpdate } from '@/models';
import { ColaboradorService } from '@/services';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Tab,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { RHFFormProvider, RHFSelect, RHFTextField } from '@softlutions/components';
import { useError } from '@softlutions/hooks';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { colaboradorResolver } from '../resolver';
import { 
  Cargo, 
  NivelAcesso, 
  NivelEscolaridade, 
  PosGraduacaoConcluida, 
  TipoEnsinoMedio,
  TipoVinculoInstituicao 
} from '@/models/dashboard/pessoa/colaborador';

// ----------------------------------------------------------------------

interface ColaboradorFormModalProps {
  open: boolean;
  currentItem: IColaborador | null;
  onClose: () => void;
  onSuccess: () => void;
}

// ----------------------------------------------------------------------

const TABS = [
  { value: 'pessoal', label: 'Dados Pessoais', icon: 'solar:user-id-bold' },
  { value: 'endereco', label: 'Endereço', icon: 'solar:map-point-bold' },
  { value: 'profissional', label: 'Dados Profissionais', icon: 'solar:case-minimalistic-bold' },
  { value: 'usuario', label: 'Acesso', icon: 'solar:lock-password-bold' },
];

// ----------------------------------------------------------------------

export function ColaboradorFormModal({
  open,
  currentItem,
  onClose,
  onSuccess,
}: ColaboradorFormModalProps) {
  const handleError = useError();
  const { enqueueSnackbar } = useSnackbar();
  const [loadedData, setLoadedData] = useState<IColaborador | null>(null);
  const [currentTab, setCurrentTab] = useState('pessoal');

  const isEdit = !!currentItem?.id;
  const methods = colaboradorResolver(loadedData, isEdit);
  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  useEffect(() => {
    if (currentItem?.id) {
      ColaboradorService.show(currentItem.id)
        .then((response) => {
          setLoadedData(response);
          reset({
            nome: response.pessoa?.nome || '',
            cpf: response.pessoa?.cpf || '',
            rg: response.pessoa?.rg || '',
            orgaoExpRg: response.pessoa?.orgaoExpRg || '',
            dataNascimento: response.pessoa?.dataNascimento?.split('T')[0] || '',
            sexo: response.pessoa?.sexo || '',
            raca: response.pessoa?.raca || '',
            nacionalidade: response.pessoa?.nacionalidade || 'Brasileira',
            paisNascimento: response.pessoa?.paisNascimento || 'Brasil',
            ufNascimento: response.pessoa?.ufNascimento || '',
            municipioNascimento: response.pessoa?.municipioNascimento || '',
            endereco: response.pessoa?.enderecos?.[0] || {},
            contato: response.pessoa?.contato || { telefones: [], emails: [] },
            usuario: response.usuario?.usuario || '',
            nivelAcesso: response.usuario?.nivelAcesso || 'Atendente Secretaria',
            nivelEscolaridade: response.nivelEscolaridade || 'Ensino médio completo',
            tipoEnsinoMedio: response.tipoEnsinoMedio || 'Formação geral',
            posGraduacaoConcluida: response.posGraduacaoConcluida || 'Não tem pós-graduação concluída',
            cargo: response.cargo || 'Operador',
            tipoVinculo: response.tipoVinculo || undefined,
            instituicaoId: response.instituicaoId || '',
            instituicaoNome: response.instituicaoNome || '',
          });
        })
        .catch((err) => {
          handleError(err, 'Erro ao carregar colaborador');
        });
    } else {
      setLoadedData(null);
      reset({
        nome: '',
        cpf: '',
        rg: '',
        orgaoExpRg: '',
        dataNascimento: '',
        sexo: '',
        raca: '',
        nacionalidade: 'Brasileira',
        paisNascimento: 'Brasil',
        ufNascimento: '',
        municipioNascimento: '',
        endereco: {
          logradouro: '',
          numero: 0,
          bairro: '',
          complemento: '',
          pontoReferencia: '',
          cep: '',
        },
        contato: {
          telefones: [],
          emails: [],
        },
        usuario: '',
        senha: '',
        nivelAcesso: NivelAcesso.Operador,
        nivelEscolaridade: NivelEscolaridade.EnsinoMedioCompleto,
        tipoEnsinoMedio: TipoEnsinoMedio.FormacaoGeral,
        posGraduacaoConcluida: PosGraduacaoConcluida.NaoTemPos,
        cargo: Cargo.Operador,
        tipoVinculo: undefined,
        instituicaoId: '',
        instituicaoNome: '',
      });
    }
  }, [currentItem, reset, open]);

  const onSubmit = handleSubmit((data: IColaboradorCreateUpdate) => {
    if (loadedData?.id) {
      ColaboradorService.update(loadedData.id, data)
        .then(() => {
          enqueueSnackbar('Colaborador atualizado com sucesso!');
          onSuccess();
          onClose();
        })
        .catch((error) => handleError(error, 'Erro ao salvar colaborador'));
    } else {
      ColaboradorService.create(data)
        .then(() => {
          enqueueSnackbar('Colaborador cadastrado com sucesso!');
          onSuccess();
          onClose();
        })
        .catch((error) => handleError(error, 'Erro ao salvar colaborador'));
    }
  });

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  // Dados Pessoais Tab
  const renderPessoalTab = () => (
    <Stack spacing={3} sx={{ pt: 2 }}>
      <RHFTextField name="nome" label="Nome Completo" fullWidth />
      
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="cpf" label="CPF" fullWidth />
        <RHFTextField name="rg" label="RG" fullWidth />
        <RHFTextField name="orgaoExpRg" label="Órgão Expedidor" fullWidth />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFDatePicker 
          name="dataNascimento" 
          label="Data de Nascimento" 
        />
        <RHFSelect name="sexo" label="Sexo" fullWidth>
          <MenuItem value="Masculino">Masculino</MenuItem>
          <MenuItem value="Feminino">Feminino</MenuItem>
          <MenuItem value="Outro">Outro</MenuItem>
        </RHFSelect>
        <RHFSelect name="raca" label="Raça/Cor" fullWidth>
          <MenuItem value="Branca">Branca</MenuItem>
          <MenuItem value="Preta">Preta</MenuItem>
          <MenuItem value="Parda">Parda</MenuItem>
          <MenuItem value="Amarela">Amarela</MenuItem>
          <MenuItem value="Indigena">Indígena</MenuItem>
          <MenuItem value="NaoDeclarada">Não declarada</MenuItem>
        </RHFSelect>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="paisNascimento" label="País de Nascimento" fullWidth />
        <RHFTextField name="ufNascimento" label="UF de Nascimento" fullWidth />
        <RHFTextField name="municipioNascimento" label="Município de Nascimento" fullWidth />
      </Stack>
    </Stack>
  );

  // Endereço Tab
  const renderEnderecoTab = () => (
    <Stack spacing={3} sx={{ pt: 2 }}>
      <RHFTextField name="endereco.cep" label="CEP" fullWidth />
      <RHFTextField name="endereco.logradouro" label="Logradouro" fullWidth />
      
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="endereco.numero" label="Número" type="number" fullWidth />
        <RHFTextField name="endereco.bairro" label="Bairro" fullWidth />
      </Stack>

      <RHFTextField name="endereco.complemento" label="Complemento" fullWidth />
      <RHFTextField name="endereco.pontoReferencia" label="Ponto de Referência" fullWidth />
    </Stack>
  );

  // Profissional Tab
  const renderProfissionalTab = () => (
    <Stack spacing={3} sx={{ pt: 2 }}>
      <RHFSelect name="cargo" label="Cargo" fullWidth>
        {Object.values(Cargo).map((cargo) => (
          <MenuItem key={cargo} value={cargo}>{cargo}</MenuItem>
        ))}
      </RHFSelect>

      <RHFSelect name="nivelEscolaridade" label="Nível de Escolaridade" fullWidth>
        {Object.values(NivelEscolaridade).map((nivel) => (
          <MenuItem key={nivel} value={nivel}>{nivel}</MenuItem>
        ))}
      </RHFSelect>

      <RHFSelect name="tipoEnsinoMedio" label="Tipo de Ensino Médio" fullWidth>
        {Object.values(TipoEnsinoMedio).map((tipo) => (
          <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
        ))}
      </RHFSelect>

      <RHFSelect name="posGraduacaoConcluida" label="Pós-graduação Concluída" fullWidth>
        {Object.values(PosGraduacaoConcluida).map((pos) => (
          <MenuItem key={pos} value={pos}>{pos}</MenuItem>
        ))}
      </RHFSelect>

      <RHFSelect name="tipoVinculo" label="Tipo de Vínculo" fullWidth>
        <MenuItem value="">Sem Vínculo</MenuItem>
        {Object.values(TipoVinculoInstituicao).map((tipo) => (
          <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
        ))}
      </RHFSelect>
    </Stack>
  );

  // Usuário Tab
  const renderUsuarioTab = () => (
    <Stack spacing={3} sx={{ pt: 2 }}>
      <RHFTextField 
        name="usuario" 
        label="Nome de Usuário" 
        fullWidth 
        disabled={isEdit}
      />
      
      {!isEdit && (
        <RHFTextField 
          name="senha" 
          label="Senha" 
          type="password" 
          fullWidth 
        />
      )}

      <RHFSelect name="nivelAcesso" label="Nível de Acesso" fullWidth>
        {Object.values(NivelAcesso).map((nivel) => (
          <MenuItem key={nivel} value={nivel}>{nivel}</MenuItem>
        ))}
      </RHFSelect>
    </Stack>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {loadedData ? 'Editar Colaborador' : 'Novo Colaborador'}
        </Typography>
      </DialogTitle>

      <RHFFormProvider methods={methods} onSubmit={onSubmit}>
        <Tabs tabs={TABS.map(tab => ({ ...tab, icon: <Iconify icon={tab.icon} /> }))} currentTab={currentTab} setCurrentTab={setCurrentTab} />

        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {currentTab === 'pessoal' && renderPessoalTab()}
            {currentTab === 'endereco' && renderEnderecoTab()}
            {currentTab === 'profissional' && renderProfissionalTab()}
            {currentTab === 'usuario' && renderUsuarioTab()}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            size="medium"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            size="medium"
            startIcon={<Iconify icon="solar:diskette-bold" />}
            loading={isSubmitting}
          >
            Salvar
          </LoadingButton>
        </DialogActions>
      </RHFFormProvider>
    </Dialog>
  );
}
