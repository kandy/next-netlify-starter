import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'


import {useState} from 'react'
import {Dropbox} from 'dropbox';

let timer;

function save(accessToken, interval) {
    let canvas = document.querySelector("#canvas"),
        dbx = new Dropbox({accessToken: accessToken});

    navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}, audio: false})
        .then((stream) => {
            let imageCapture = new ImageCapture(stream.getVideoTracks()[0]);

            let upload = () => imageCapture.takePhoto().then((photo) => {
                canvas.src = URL.createObjectURL(photo);

                dbx.filesUpload({path: '/test' + Date.now() + '.jpg', contents: photo})
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((uploadErr) => {
                        console.log(uploadErr);
                    });
            });

            if (timer != undefined) { clearInterval(timer)};
            timer = setInterval(upload, parseInt(interval, 10)  /* s */ * 1000);
            upload();
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
                <img id="canvas" width="800" height="600"></img>

            </main>

            <Footer/>
        </div>
    )
}
