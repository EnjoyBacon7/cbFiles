import ai from '../fileIcons/ai.png';

export function IconImg(props) {

    const filePath = `../fileIcons/${props.filetype}.png`;

    return (
        <div>
            <img src={"../fileIcons/ai.png"} alt="icon" width={50}/>
        </div>
    );
}

export default IconImg;