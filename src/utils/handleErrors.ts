const handleErrors = (error: any) => {
    if(error.data?.message?.includes("JWT")){
        localStorage.clear();
        window.location.href = "/login";
    }
    console.log({error})
}

export {
    handleErrors
}