import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import anime from 'animejs'
import PageNotFound from '../images/PageNotFound.svg'

export default function NotFoundPage() {
    useEffect(() => {
        anime({ targets: '#centerDiv', easing: 'easeInOutSine', opacity: [0, 1], delay: 500 })
    }, [])

    return (
        <div style={{ textAlign: 'center' }}>
            <br />
            <br />
            <div id="centerDiv" style={{ margin: 'auto' }}>
                <img src={PageNotFound} height="200px" width="200px" alt="page not found" />
                <br /><br />
                <h2 style={{ color: 'red' }}>
                    You have entered a broken link <br />
                    Page is not found <br />
                    Click the button below to go back to home page
                </h2>
                <br />
                <Link to="/">
                    <button style={{
                        padding: '10px',
                        borderRadius: '5px',
                        color: 'white',
                        backgroundColor: '#dbc268',
                        fontSize: '32px',
                        textAlign: 'center',
                        border: '2px solid black',
                        fontFamily: 'Old Standard TT',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}>
                        Home
                    </button>
                </Link>
            </div>
        </div>
    )
}
