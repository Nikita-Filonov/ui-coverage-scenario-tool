import { BaseModal } from '../../BaseModal';
import { ElementDetailsView } from '../../../../Views/Agent/Elements/ElementDetailsView';
import { FC } from 'react';
import { ElementCoverage } from '../../../../Models/Coverage/Coverage';
import { SxProps, Theme } from '@mui/system';

type Props = {
  sx?: SxProps<Theme>;
  modal: boolean;
  setModal: (modal: boolean) => void;
  element: ElementCoverage;
};

export const ElementDetailsModal: FC<Props> = ({ sx, modal, setModal, element }) => {
  return (
    <BaseModal sx={sx} title={'Element details'} modal={modal} setModal={setModal} maxWidth={'md'}>
      <ElementDetailsView element={element} />
    </BaseModal>
  );
};
