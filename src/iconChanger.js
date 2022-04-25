
let icon = document.getElementById("s-icon")

export default function changeIcon() {
    let tmp = document.getElementsByClassName("bg-primary absolute top-1/2 right-4 h-[10px] w-[10px] -translate-y-1/2 rounded-full")
    if(tmp.length==0){
        icon.href="icon.svg"
    }
    else if(tmp.length>0 && tmp.length<9){
        icon.href=`notification/nt${tmp.length}.svg`
    }
    else icon.href="notification/nt9.svg"
    return true
}