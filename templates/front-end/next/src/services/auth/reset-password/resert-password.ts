'use client';

import axios from 'axios';

import { userService } from '@/services/user';
import { getLocalItem } from '@softlutions/utils';

// ----------------------------------------------------------------------

async function update(password: string): Promise<any> {
  const response = await axios.put(
    `https://central.lasercinemas.com.br/admin/realms/cinelaser/users/${getLocalItem('user')
      ?.sub}/reset-password`,
    {
      type: 'password',
      value: password,
      temporary: false,
    },
  );

  userService.update({
    complete_name: getLocalItem('user')?.complete_name,
    update_password: false,
  });

  return response;
}

export const PasswordService = {
  update,
};
