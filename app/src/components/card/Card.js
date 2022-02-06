import './Card.css';

const Card = (props) => {
    return(
        <div className="card">
            <p>{props.tier}</p>
            <p>Price: ${props.price}</p>
            <img src={require(`../../assets/img/${props.img}.png`)} alt="card ilustration" width={200}/>
            <br/>
            <button>Select</button>
        </div>
    )
}

export default Card;
