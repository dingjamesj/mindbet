const { createClient } = require("@supabase/supabase-js")
require("dotenv").config()

const iWillTouchRonsonASAP = async () => {

    console.log("Ronson will be touched ASAP by the following people: ")
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
    const {data, error} = await supabase.from("rooms").select()

    for(let i = 0; i < data.length; i++) {

        console.log(data[i].username + " in room " + data[i].roomid);

    }

}

module.exports.jamesTestFunctions = iWillTouchRonsonASAP