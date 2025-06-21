const { createClient } = require("@supabase/supabase-js")

const iWillTouchRonsonASAP = async () => {

    console.log("Ronson will be touched ASAP")
    const supabase = createClient('https://dlzodfsjelohzypktvot.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsem9kZnNqZWxvaHp5cGt0dm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0OTExNzksImV4cCI6MjA2NjA2NzE3OX0.xBl8nJMYvrOqEBymRqeYx9yFLVnVSbEFUjm9qfyDVyk')
    const {data, error} = await supabase.from("testing").select()
    console.log(data)

}

module.exports.jamesTestFunctions = iWillTouchRonsonASAP