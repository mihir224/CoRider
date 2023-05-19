import React, {useEffect,useState} from 'react';
import axios from 'axios';
import '../styles/Chat.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import {format} from 'date-fns';

function Chat(){
    const [chat,setChat]=useState({});
    const [date,setDate]=useState('')
    const [isLoading,setIsLoading]=useState(false);
    const [err,setErr]=useState(false);
    useEffect(()=>{
        setIsLoading(true);
        const fetchChat=async()=>{
            try{
                const chatData=await axios.get('https://3.111.128.67/assignment/chat?page=0');
                setIsLoading(false);
                setChat(chatData.data);
                setDate(chatData.data.chats[0]?.time.split(" ")[0]);
            }catch(err){
                console.log(err);
                setIsLoading(false);
                setErr(true);
            }
        }
        fetchChat();
    },[])
    console.log(chat)
    if(err){
        return <h2>Couldn't load chat. Try again.</h2>
    }
    return isLoading?<h1>Loading...</h1>:(
        <div id='chat'>
        <div id='chat-header'>
        <h2><ArrowBackIcon/> Trip {chat.name?.split(" ")[2]}</h2>
        <div id='src-dst'>
            {chat.from&&<p><span>From</span> {chat.from}</p>}
            {chat.to&&<p><span>To</span> {chat.to}</p>}
        </div>
        </div>
        <div id='chat-box'>
        {date&&<p id='date' style={{color:'black'}}><span>{format(new Date(date),'do MMMM yyyy')}</span></p>}
        {chat.chats?.map((text)=>{
            if(text.sender.self){
                return(
                    <div id='user' className='chat-text'>{text.message}</div>
                )
            }
            else if(!text.sender.self){
                return (
                    <div className='text-box'>
                        <img className='text-img' src={text.sender.image} alt={text.sender.self?'user':'receiver'}></img>
                        <div id={text.sender.self?'user':'receiver'} className='chat-text'> {text.message}</div>
                    </div>                
                    )
            }
        })}
        </div>
        <div id='chat-footer'>
            <input type='text' placeholder='Reply to @MihirSaini'></input>
            <div>
            <AttachFileOutlinedIcon className='footer-icon'/>
            <SendOutlinedIcon className='footer-icon'/>
            {/* <button id='send' type='button'>file</button>
            <button id='send' type='submit'>send</button> */}
            </div>
        </div>
        </div>
    )
}

export default Chat;
