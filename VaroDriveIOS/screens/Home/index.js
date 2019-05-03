import { connect } from 'react-redux'
import * as actions from '../../redux/actions/auth.actions'
import HomeScreen from './Home'

export default connect(
    state => ({
        test: state.auth
    }),
    dispatch => ({ dispatch, actions })
)(HomeScreen)