import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

jest.useFakeTimers();
Enzyme.configure({ adapter: new Adapter() });
