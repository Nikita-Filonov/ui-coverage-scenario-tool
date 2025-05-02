import { useMemo, useState } from 'react';
import { useInitialState } from '../../Providers/InitialStateProvider';
import { ElementCoverageTable } from '../../Components/Tables/Agent/Elements/ElementCoverageTable';
import { ElementDetailsModal } from '../../Components/Modals/Agent/Elements/ElementDetailsModal';
import { ElementCoverage } from '../../Models/Coverage/Coverage';
import { SearchView } from '../../Components/Views/SearchView';
import { WidgetView } from '../../Components/Views/WidgetView';

export const ElementCoverageView = () => {
  const { appCoverage } = useInitialState();
  const [search, setSearch] = useState('');
  const [element, setElement] = useState<ElementCoverage | null>(null);
  const [elementDetailsModal, setElementDetailsModal] = useState(false);

  const filteredElements = useMemo(
    () => appCoverage.elements.filter((element) => element.selector.toLowerCase().includes(search.toLowerCase())),
    [search, appCoverage.elements]
  );

  const onElementDetails = (element: ElementCoverage) => {
    setElement(element);
    setElementDetailsModal(true);
  };

  return (
    <WidgetView sx={{ mt: 3 }} title={'Elements'}>
      <SearchView
        search={search}
        setSearch={setSearch}
        placeholder={'Search by selector'}
        totalResults={filteredElements.length}
      />
      <ElementCoverageTable elements={filteredElements} onElementDetails={onElementDetails} />
      {element && (
        <ElementDetailsModal modal={elementDetailsModal} setModal={setElementDetailsModal} element={element} />
      )}
    </WidgetView>
  );
};
