import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'


import {useState} from 'react'
import {Dropbox} from 'dropbox';

const imageFormat = "image/jpeg";

function base64ToArrayBuffer(base64) {
    let data = base64.split('base64,')[1];
    let binary_string = window.atob(data),
        len = binary_string.length,
        bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function save(accessToken, interval) {
    let video = document.querySelector("#video"),
        canvas = document.querySelector("#canvas"),
        dbx = new Dropbox({accessToken: accessToken});

    navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}, audio: false})
        .then((stream) => {
            video.srcObject = stream;
            video.addEventListener("play", () => {
                setTimeout(() => {
                    canvas.width = video.width;
                    canvas.height = video.height;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    let data = canvas.toDataURL(imageFormat);
                    dbx.filesUpload({path: '/test' + Date.now() + '.jpg', contents: base64ToArrayBuffer(data)})
                        .then((response) => {
                            console.log(response);
                        })
                        .catch((uploadErr) => {
                            console.log(uploadErr);
                        });
                }, 1000 /*ms*/)

            }, false);
            setInterval(() => {
                video.play();
                setInterval(() => video.pause(), 2000)
            }, parseInt(interval, 10) * 1000)
        });
}

export async function getStaticProps() {
    return {
       // key: '123',
        props: {
            "access_kay": process.env.ACCESS_TOKEN
        } //
    }
}
export default function Home({access_kay}) {
    const [interval, setIntervalValue] = useState(3600)

    return (


        <div className="container">
            <Head>
                <title>Next.js Starter!</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main>
                <Header title="Welcome to my app!"/>
                <div>{ interval }</div>
                <div>
                    <input type="text" value={ interval }
                            onChange={(e) => setIntervalValue(e.target.value)} />
                </div>
                <button onClick={() => save(access_kay, interval)}>Start Recording</button>
                <video id="video" width="800" height="600"></video>
                <canvas id="canvas"></canvas>

            </main>

            <Footer/>
        </div>
    )
}
