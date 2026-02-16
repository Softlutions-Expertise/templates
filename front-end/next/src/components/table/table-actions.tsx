'use client';

import { ConfirmDialog } from '@/components';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { LoadingButton } from '@mui/lab';
import { IconButton, Tooltip, TooltipProps } from '@mui/material';
import { IUseCheckRoleProps, useCheckRole } from '@softlutions/hooks';
import React from 'react';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface ICommomActions {
  tooltip?: string;
  icon?: any;
  color?: string;
  onClick?: () => void;
  render?: boolean;
  disabled?: boolean;
  disableTouchRipple?: boolean;
  roles?: IUseCheckRoleProps;
}

interface OtherActions extends ICommomActions {}

interface PropsDelete extends ICommomActions {
  dialog?: {
    title?: string;
    content?: string | React.ReactNode;
    nameItem: string;
    nameModel: string;
    textConfirm?: string;
    onClick: () => void;
  };
}

interface PropsViewer extends ICommomActions {}

interface PropsEdit extends ICommomActions {}

interface Props {
  row: any;
  viewer?: PropsViewer;
  edit?: PropsEdit;
  deleter?: PropsDelete;
  startOtherActions?: OtherActions[];
  endOtherActions?: OtherActions[];
  disabledAll?: boolean;
  direction?: 'row' | 'column';
  placement?: TooltipProps['placement'];
  disbledHover?: boolean;
}

export function TableActions({
  row,
  viewer,
  edit,
  deleter,
  startOtherActions,
  endOtherActions,
  disabledAll,
  placement = 'bottom',
  disbledHover,
}: Props) {
  const { checkRole } = useCheckRole();
  const { watch, setValue } = useFormContext();
  const { confirm, currentRow, loading } = watch();

  return (
    <>
      {startOtherActions?.map((item) => {
        if ((item?.render ?? true) && checkRole(item?.roles || [])) {
          return (
            <Tooltip key={item?.tooltip} title={item?.tooltip} placement={placement}>
              <IconButton
                disabled={disabledAll || item?.disabled || false}
                sx={{
                  color: item?.color || 'default',
                  opacity: disabledAll || item?.disabled || false ? 0.5 : 1,
                  mr: -1,
                  '&:hover': disbledHover
                    ? {
                      backgroundColor: 'transparent',
                    }
                    : {},
                }}
                onClick={item?.onClick}
                disableTouchRipple={item?.disableTouchRipple || false}
              >
                {item?.icon}
              </IconButton>
            </Tooltip>
          );
        }
      })}

      {(viewer?.render ?? true) && viewer && Object.keys(viewer).length > 0 && checkRole(viewer?.roles || []) ? (
        <Tooltip title={viewer?.tooltip || 'Visualizar'} placement={placement}>
          <IconButton
            color="default"
            onClick={viewer?.onClick}
            disabled={viewer?.disabled || disabledAll}
            sx={{
              opacity: viewer?.disabled || disabledAll ? 0.5 : 1,
              mr: -1,
              '&:hover': disbledHover
                ? {
                  backgroundColor: 'transparent',
                }
                : {},
            }}
            disableTouchRipple={viewer?.disableTouchRipple || false}
          >
            {viewer?.icon || <RemoveRedEyeIcon sx={{ fontSize: '1.3rem' }} />}
          </IconButton>
        </Tooltip>
      ) : (
        ''
      )}

      {(edit?.render ?? true) && edit && Object.keys(edit).length > 0 && checkRole(edit?.roles || []) ? (
        <Tooltip title={edit?.tooltip || 'Editar'} placement={placement}>
          <IconButton
            color="default"
            onClick={edit?.onClick}
            disabled={edit?.disabled || disabledAll}
            sx={{
              opacity: edit?.disabled || disabledAll ? 0.5 : 1,
              mr: -1,
              '&:hover': disbledHover
                ? {
                  backgroundColor: 'transparent',
                }
                : {},
            }}
            disableTouchRipple={edit?.disableTouchRipple || false}
          >
            {edit?.icon || <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />}
          </IconButton>
        </Tooltip>
      ) : (
        ''
      )}

      {(deleter?.render ?? true) && deleter && Object.keys(deleter).length > 0 && checkRole(deleter?.roles || []) ? (
        <Tooltip title={deleter?.tooltip || 'Deletar'} placement={placement}>
          <IconButton
            color="default"
            onClick={
              deleter?.onClick
                ? deleter?.onClick
                : () => {
                  setValue('confirm', true);
                  setValue('currentRow', row);
                }
            }
            disabled={deleter?.disabled || disabledAll}
            sx={{
              opacity: deleter?.disabled || disabledAll ? 0.5 : 1,
              mr: -1,
              '&:hover': disbledHover
                ? {
                  backgroundColor: 'transparent',
                }
                : {},
            }}
            disableTouchRipple={deleter?.disableTouchRipple || false}
          >
            {deleter?.icon || <DeleteIcon color="error" sx={{ fontSize: '1.3rem' }} />}
          </IconButton>
        </Tooltip>
      ) : (
        ''
      )}

      {deleter?.dialog && (
        <ConfirmDialog
          open={confirm}
          onClose={() => setValue('confirm', false)}
          title={deleter?.dialog?.title || 'Deletar'}
          content={
            deleter?.dialog?.content ? (
              deleter?.dialog?.content
            ) : (
              <>
                Deseja {deleter?.dialog?.title?.toLocaleLowerCase() || 'deletar'} o item{' '}
                <strong>{currentRow?.[deleter.dialog.nameItem]}</strong> de{' '}
                {deleter?.dialog?.nameModel}?
              </>
            )
          }
          action={
            <LoadingButton
              variant="contained"
              color="error"
              onClick={deleter?.dialog?.onClick}
              loading={loading}
            >
              {deleter?.dialog?.textConfirm || 'Sim, deletar'}
            </LoadingButton>
          }
        />
      )}

      {endOtherActions?.map((item: any) => {
        if ((item?.render ?? true) && checkRole(item?.roles || [])) {
          return (
            <Tooltip key={item?.tooltip} title={item?.tooltip} placement={placement}>
              <IconButton
                disabled={disabledAll || item?.disabled || false}
                sx={{
                  color: item?.color || 'default',
                  opacity: disabledAll || item?.disabled || false ? 0.5 : 1,
                  mr: -1,
                  '&:hover': disbledHover
                    ? {
                      backgroundColor: 'transparent',
                    }
                    : {},
                }}
                onClick={item?.onClick}
                disableTouchRipple={item?.disableTouchRipple || false}
              >
                {item?.icon}
              </IconButton>
            </Tooltip>
          );
        }
      })}
    </>
  );
}
