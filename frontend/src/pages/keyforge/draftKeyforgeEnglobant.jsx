import DraftKeyforge from './draftKeyforge';
import { KeyforgeContextProvider } from '../../components/contexts/keyforgeContext';

const DraftKeyforgeEnglobant = () => {
    return (
        <KeyforgeContextProvider>
            <DraftKeyforge />
        </KeyforgeContextProvider>
    )
};

export default DraftKeyforgeEnglobant;