import { connect } from 'react-redux'
import * as actions from '../../redux/actions/auth.actions'
import InventoryScreen from './Inventory'

export default connect(
  state => ({
    test: state.auth
  }),
  dispatch => ({ dispatch, actions })
)(InventoryScreen)