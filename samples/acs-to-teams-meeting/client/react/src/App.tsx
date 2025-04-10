import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {  
  CallComposite, 
  fromFlatCommunicationIdentifier, 
  useAzureCommunicationCallAdapter 
} from '@azure/communication-react';
import React, { useState, useMemo, useEffect } from 'react';
import './App.css';

const App = () => { 
  const displayName = 'Guest'
  const [userId, setUserId] = useState<string>('8:acs:1b93d1a3-ff30-4b9f-91f2-25694197de9a_00000026-bf79-ddbb-defd-8b3a0d003df4');
  const [token, setToken] = useState<string>('eyJhbGciOiJSUzI1NiIsImtpZCI6IkY1M0ZEODA0RThBNDhBQzg4Qjg3NTA3M0M4MzRCRDdGNzBCMzBENDUiLCJ4NXQiOiI5VF9ZQk9pa2lzaUxoMUJ6eURTOWYzQ3pEVVUiLCJ0eXAiOiJKV1QifQ.eyJza3lwZWlkIjoiYWNzOjFiOTNkMWEzLWZmMzAtNGI5Zi05MWYyLTI1Njk0MTk3ZGU5YV8wMDAwMDAyNi1iZjc5LWRkYmItZGVmZC04YjNhMGQwMDNkZjQiLCJzY3AiOjE3OTIsImNzaSI6IjE3NDQyODY3OTIiLCJleHAiOjE3NDQzNzMxOTIsInJnbiI6ImFtZXIiLCJhY3NTY29wZSI6ImNoYXQsdm9pcCIsInJlc291cmNlSWQiOiIxYjkzZDFhMy1mZjMwLTRiOWYtOTFmMi0yNTY5NDE5N2RlOWEiLCJyZXNvdXJjZUxvY2F0aW9uIjoidW5pdGVkc3RhdGVzIiwiaWF0IjoxNzQ0Mjg2NzkyfQ.UjicwHoRKe1SOkVX27IhWLd6BGvMqG07I4enbRDUAUbTqlmJ1-i8CE0gRY7B3LNFvQnfR-fij1gIxfEKHAWFpSOs3afz-I9CATvdXJ5auIKJYl_T9mSoz7JKt5FEhHztEDFDcLYGmCQGtrlS7rSD5MTEvxl_63OQh-TXwaphMtbNfI2yf5Phw4LVxquiL9Zq00Ncn5ODJYwLAPxSMWYmoDBPKi4kPrHlUzxe-zyXqmEAf2VX25eQUgl1lC0YtWZWO5EvNaDebYAp7L8iIzb_RhIBIzfqIvgwk9hFbqm_ZP6wpeuF-PucuV4aOzFElMVlwz_u4OceFPGOdmLfm-SEdg');
  const [teamsMeetingLink, setTeamsMeetingLink] = useState<string>('https://teams.microsoft.com/l/meetup-join/19%3ameeting_OGE0NjkwZWQtMWVjNS00YTZiLTg3NDYtNjVmYWFmMjJhNDM2%40thread.v2/0?context=%7b%22Tid%22%3a%22ed84fe55-74a8-471c-a22b-5457749fd6d5%22%2c%22Oid%22%3a%228c1e5d9f-6762-41c2-9a00-0ecdd45acbb1%22%7d');
  const [message, setMessage] = useState<string>('');
  const credential = useMemo(() => {
    if (token) {
      return new AzureCommunicationTokenCredential(token)
    }
    return;
    }, [token]);

  const callAdapterArgs = useMemo(() => {
    if (userId && credential && displayName && teamsMeetingLink) {
      return {
        userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
        displayName,
        credential,
        locator: { meetingLink: teamsMeetingLink },
      }
    }
    return {};
  }, [userId, credential, displayName, teamsMeetingLink]);

  const callAdapter = useAzureCommunicationCallAdapter(callAdapterArgs);

  useEffect(() => {
     /* Commenting out for now
    const init = async () => {
        setMessage('Getting ACS user');
        //Call Azure Function to get the ACS user identity and token
        let res = await fetch(process.env.REACT_APP_ACS_USER_FUNCTION as string);
        let user = await res.json();
        setUserId(user.userId);
        setToken(user.token);

        setMessage('Getting Teams meeting link...');
        //Call Azure Function to get the meeting link
        res = await fetch(process.env.REACT_APP_TEAMS_MEETING_FUNCTION as string);
        let link = await res.text();
        setTeamsMeetingLink(link);
        setMessage('');
        console.log('Teams meeting link', link);
    }
    init();
    */

}, []);

  if (callAdapter) {
    return (
      <div>
        <h1>Contact Customer Service</h1>
        <div className="wrapper">
          <CallComposite
            adapter={callAdapter}
          />
        </div>
      </div>
    );
  }
  if (!credential) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  if (message) {
    return <div>{message}</div>;
  }
  return <div>Initializing...</div>;
};

export default App;