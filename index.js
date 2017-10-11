/* global chrome */
'use strict'

import React from 'react'
import {render} from 'react-dom'

import manifest from './manifest'
import fire from './firebase'

import axios from 'axios'

const API_KEY = 'AIzaSyCXto9gID3mK91DuZqujXhSbQghcOyas7M' // browser-safe key

const withToken = func => (...args) => new Promise((resolve, reject) =>
  chrome.identity.getAuthToken({interactive: true}, token => token ? resolve(func(token, ...args)) : reject(token)))

const cohortRe = /\d\d\d\d-([A-Z]+)-([A-Z]+)-(Sr|Jr)/

const listCalendars = withToken(token =>
  axios.get(`https://content.googleapis.com/calendar/v3/users/me/calendarList?key=${API_KEY}`, {
    headers: {authorization: `Bearer ${token}`}
  }).then(rsp => rsp.data.items))

const listEvents = withToken((token, calId, min, max) =>
  axios.get(`https://content.googleapis.com/calendar/v3/calendars/${calId}/events?key=${API_KEY}&timeMin=${min}&timeMax=${max}`, {
    headers: {authorization: `Bearer ${token}`}
  }).then(rsp => rsp.data.items)
)

class Calendar extends React.Component {
  state = {
    events: []
  }

  componentDidMount() {
    listEvents(this.props.calendarId,
      new Date(Date.now() - 1000 * 3600).toISOString(),
      new Date(Date.now() + 1000 * 3600 * 24 * 7).toISOString())
      .then(events => this.setState({events}))
  }

  render() {
    const {events} = this.state
    return <ol> {
      events.map(event => <li key={event.id}>{JSON.stringify(event, 0, 2)}</li>)
    } </ol>
  }
}

class Calendars extends React.Component {
  state = {
    calendars: [],
    selectedCalendar: null,
  }

  componentDidMount() {
    listCalendars().then(calendars => {
      const cohortCalendars = calendars
        .filter(cal => cohortRe.test(cal.summary))
      this.setState({
        calendars: cohortCalendars,
        selectedCalendar: cohortCalendars[0]
      })
    })
  }

  render() {
    const {calendars, selectedCalendar} = this.state
    return <div>
      {selectedCalendar ? <div><h1>{selectedCalendar.summary}</h1><Calendar calendarId={selectedCalendar.id} /></div> : <ul> {
        calendars.map(cal => <li key={cal.id}>{JSON.stringify(cal, 0, 2)}</li>)
      } </ul>}
    </div>
  }
}

render(
  <Calendars />,
  document.getElementById('main'))
