import { FC, useState } from 'react';
import { ElementCoverage } from '../../../Models/Coverage/Coverage';
import { useElement } from '../../../Services/Frame/Element';
import { BasePopper } from '../../../Components/Poppers/BasePopper';
import { ElementDetailsModal } from '../../../Components/Modals/Agent/Elements/ElementDetailsModal';
import IconButton from '@mui/material/IconButton';
import { useAgentInitialState } from '../../../Providers/AgentInitialStateProvider';
import { ElementBadge } from '../../../Components/Badges/Agent/Elements/ElementBadge';

type Props = {
  element: ElementCoverage;
};

export const ElementView: FC<Props> = ({ element }) => {
  const { state } = useAgentInitialState();
  const { node } = useElement({ type: element.selectorType, value: element.selector, settings: state.settings });
  const [elementDetailsModal, setElementDetailsModal] = useState(false);

  if (!node) return null;

  const onElementDetails = () => setElementDetailsModal(true);

  return (
    <BasePopper anchor={node}>
      <IconButton onClick={onElementDetails}>
        <ElementBadge actions={element.actions} settings={state.settings} />
      </IconButton>
      <ElementDetailsModal
        sx={{ zIndex: 1900 }}
        modal={elementDetailsModal}
        setModal={setElementDetailsModal}
        element={element}
      />
    </BasePopper>
  );
};
