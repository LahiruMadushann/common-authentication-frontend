import StatusType from "../data/choises.json";

export const getColorForStatusType = (typeParam: any) => {
    let word = ""
    const type =  StatusType.status.filter(item => item.value === typeParam)
    
    if(type.length){
        word = type[0].label
    }

    if(word === "未対応"){
        return "red"
    }else if(word === "未対応"){
        return "green"
    }else if(word === "接続済み査定無し"){
        return "pink"
    }else if(word === "查定予約"){
        return "orange"
    }else if(word === "査定済み"){
        return "brown"
    }else if(word === "未成約"){
        return "black"
    }else if(word === "成約済み"){
        return "purple"
    }else if(word === "媒体重複"){
        return "#eb4034"
    }else if(word === "他社売却"){
        return "#ebb134"
    }else if(word === "対応中"){
        return "yellow"
    }else if(word === "アポ確定"){
        return "blue"
    }else if(word === "送客済"){
        return "gray"
    }else if(word === "メール送信予約済み"){
        return "#b78ee7"

    }else if(word === "却下申請中"){
        return "#26a65b"

    }else if(word === "却下申請承認"){
        return "#7d059c"

    }else if(word === "却下申請棄却"){
        return "#6a4c6e"
    }else if(word === "キャンセル済み"){
        return "#9c0532"
    }else if(word === "ユーザークレーム"){
        return "#97c49e"
    
    }else{
        return "gray"
    }
}