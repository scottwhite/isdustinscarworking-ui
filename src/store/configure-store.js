import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers'
import createLogger from 'redux-logger'
import createSagaMiddleware, { END } from 'redux-saga'

//mostly from
//https://github.com/yelouafi/redux-saga/blob/master/examples/real-world/store/configureStore.dev.js
export default function configureStore(initialState, history) {
  const sagaMiddleware = createSagaMiddleware()
  const middleware = [sagaMiddleware]

  if(process.env.NODE_ENV === 'dev'){
    middleware.push(createLogger)
  }

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(
        ...middleware
      )
    )
  )
  if(process.env.NODE_ENV === 'dev'){
    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('../reducers', () => {
        const nextRootReducer = require('../reducers').default
        store.replaceReducer(nextRootReducer)
      })
    }
  }
  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  return store
}
