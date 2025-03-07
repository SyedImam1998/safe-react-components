import * as React from 'react';
import { useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { isAddress } from '@ethersproject/address';

import { shortenAddress } from './utils';

import Identicon from './Identicon';
import CopyAddressButton from './CopyAddressButton';
import ExplorerButton, { ExplorerButtonProps } from '../ExplorerButton';

import typography from '../../theme/typography';

export type EthHashInfoProps = {
  address: string;
  chainId?: string;
  name?: string | null;
  showAvatar?: boolean;
  showCopyButton?: boolean;
  prefix?: string;
  showPrefix?: boolean;
  copyPrefix?: boolean;
  shortAddress?: boolean;
  customAvatar?: string;
  hasExplorer?: boolean;
  avatarSize?: number;
  children?: React.ReactNode;
  ExplorerButtonProps?: ExplorerButtonProps;
};

const EthHashInfo = ({
  address,
  customAvatar,
  prefix = '',
  copyPrefix,
  showPrefix,
  shortAddress = true,
  showAvatar = true,
  avatarSize,
  name,
  showCopyButton,
  hasExplorer,
  ExplorerButtonProps,
  children,
}: EthHashInfoProps): React.ReactElement => {
  const [fallbackToIdenticon, setFallbackToIdenticon] = React.useState(false);
  const shouldPrefix = isAddress(address);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onError = React.useCallback(() => {
    setFallbackToIdenticon(true);
  }, []);

  return (
    <Container>
      {showAvatar && (
        <AvatarContainer size={avatarSize}>
          {!fallbackToIdenticon && customAvatar ? (
            <img
              src={customAvatar}
              alt={address}
              onError={onError}
              width={avatarSize}
              height={avatarSize}
            />
          ) : (
            <Identicon address={address} size={avatarSize} />
          )}
        </AvatarContainer>
      )}

      <Box overflow="hidden">
        {name && (
          <Box
            sx={{ fontSize: typography.body2?.fontSize }}
            textOverflow="ellipsis"
            overflow="hidden"
            title={name}>
            {name}
          </Box>
        )}

        <AddressContainer>
          <Box fontWeight="inherit" fontSize="inherit">
            {showPrefix && shouldPrefix && prefix && <b>{prefix}:</b>}
            <span>
              {shortAddress || isMobile ? shortenAddress(address) : address}
            </span>
          </Box>

          {showCopyButton && (
            <CopyAddressButton
              
              address={address}
              
            />
          )}

          {hasExplorer && ExplorerButtonProps && (
            <ExplorerButton {...ExplorerButtonProps} />
          )}

          {children}
        </AddressContainer>
      </Box>
    </Container>
  );
};

const Container = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5em',
  lineHeight: 1.4,
});

const AvatarContainer = styled('div')<{ size?: number }>(({ size }) => ({
  flexShrink: 0,
  width: size || '2.3em !important',
  height: size || '2.3em !important',
  '> *': {
    width: '100% !important',
    height: '100% !important',
  },
}));

const AddressContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25em',
  whiteSpace: 'nowrap',
});

export default EthHashInfo;
