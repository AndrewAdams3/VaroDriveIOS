import { connect } from 'react-redux'
import * as actions from '../../redux/actions/auth.actions'
import LoginScreen from './Login'

export default connect(
    state => ({
        test: state.auth
    }), 
    dispatch => ({dispatch, actions})
)(LoginScreen)

