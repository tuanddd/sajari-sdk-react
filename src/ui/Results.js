import React from 'react'
import { connect } from 'react-redux'

import { REQUEST_SUCCEEDED, REQUEST_IN_PROGRESS } from '../api/constants/RequestState'
import { resultClicked } from './actions/Analytics'

// import { WrappedPaginator as Paginator } from './Paginator'

const tokenUrl = 'https://www.sajari.com/token/'

/**
 * TokenLink renders an 'a' element that switches to using a token when clicked
 */
class TokenLink extends React.Component {
  constructor(props) {
    super(props)
    this.state = { clicked: false }
    this.click = this.click.bind(this)
  }

  click() {
    this.setState({ clicked: true })
    if (this.props.resultClicked) {
      this.props.resultClicked(this.props.url)
    }
  }

  render() {
    const url = this.state.clicked ? (tokenUrl + this.props.token) : this.props.url
    return (
      <a href={url} onMouseDown={this.click}>
        {this.props.text}
        {this.props.children}
      </a>
    )
  }
}

TokenLink.propTypes = {
  url: React.PropTypes.string.isRequired,
}

const Title = ({ title, url, token, resultClicked }) => (
  <h3 className='sj-result-title'>
    <TokenLink token={token} url={url} text={title} resultClicked={resultClicked} />
  </h3>
)

const Description = ({ description }) => (
  <p className='sj-result-description'>{description}</p>
)

const Url = ({ url, token, resultClicked }) => (
  <p className='sj-result-url'><TokenLink token={token} url={url} text={url} resultClicked={resultClicked} /></p>
)

class Image extends React.Component {
  constructor(props) {
    super(props)
    this.state = {show: true}
  }

  render() {
    const onError = () => this.setState({ show: false })
    return <img className='sj-result-image' style={this.state.show ? undefined : { display: 'none' }} onError={onError} src={this.props.url} alt={this.props.title} />
  }
}

Image.propTypes = {
  title: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired
}

const Result = ({ title, description, url, token, showImage, image, resultClicked }) => (
  <div className='sj-result'>
    {showImage ? (
      <TokenLink token={token} url={url}>
        <Image url={image} title={title} />
      </TokenLink>
    ) : null}
    <Title title={title} url={url} token={token} resultClicked={resultClicked} />
    <Description description={description} />
    <Url url={url} token={token} resultClicked={resultClicked} />
    {showImage ? <div className='sj-result-close'/> : null}
  </div>
)

const resultSummary = ({ body, completion, total, queryTime, page }) => {
  let pageNumber = ''
  if (page && page > 1) {
    pageNumber = `Page ${page} of `
  }

  const resultsFor = completion || body

  if (resultsFor) {
    return <div id='sj-result-summary'>{`${pageNumber}${total} results for `}&quot;<strong>{resultsFor}</strong>&quot;{` (${queryTime})`}</div>
  }
  return <div id='sj-result-summary' />
}

const ResultSummary = connect(
  ({ query }, { namespace }) => {
    let completion = ''
    try {
      completion = query.queryStatus[namespace].data.searchRequest.indexQuery.body[0].text
    } catch (e) {}
    return { completion }
  },
)(resultSummary)

class Results extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.status !== REQUEST_IN_PROGRESS
  }

  render() {
    const { data, resultClicked } = this.props

    if (!data || !data.searchResponse || !data.searchResponse.results) {
      return <div className='sj-result-list' />
    }

    const results = data.searchResponse.results.map((r, index) => (
      <Result
        key={r.values._id || ""+index+r.values.url}
        title={r.values.title}
        description={r.values.description}
        url={r.values.url}
        token={r.tokens.click.token}
        resultClicked={resultClicked}
      />
    ))
    return <div className='sj-result-list'>{results}</div>
  }
}

const WrappedResults = connect(
  null,
  dispatch => ({
    resultClicked: url => dispatch(resultClicked(url)),
  })
)(Results)

function queryTimeToSeconds(t) {
  const parseAndFormat = x => (parseFloat(t) / x).toFixed(5) + 's'
  if (t.indexOf('ms') >= 0) {
    return parseAndFormat(1000)
  }
  if (t.indexOf('µs') >= 0) {
    return parseAndFormat(1000000)
  }
  return t
}

class summary extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.status !== REQUEST_IN_PROGRESS
  }

  render() {
    const { searchText, searchTextRewritten, totalResults, time, page, status } = this.props

    // Don't render anything if there isn't a successful request
    if (status !== REQUEST_SUCCEEDED) {
      return <div className='sj-result-summary'/>
    }

    const pageNumber = page && page > 1 ? `Page ${page} of ` : ''

    return (
      <div className='sj-result-summary'>
        {`${pageNumber}${totalResults} results for `}
        &quot;<strong>{searchTextRewritten || searchText}</strong>&quot;
        {` (${queryTimeToSeconds(time)})`}
      </div>
    )
  }
}

export { Results, Result, ResultSummary, Title, Description, Url, TokenLink, Image, WrappedResults }
