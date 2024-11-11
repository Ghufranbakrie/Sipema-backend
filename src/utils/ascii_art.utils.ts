export const REST_ASCII_ART = `
  
              ___        __                 __              
.-----.--.--.'  _|.----.|__|.-----.-----.--|  |.-----.-----.
|  _  |  |  |   _||   _||  ||  -__|     |  _  ||__ --|__ --|
|___  |_____|__|  |__|  |__||_____|__|__|_____||_____|_____|
|_____|                                                     
 
                                             
`
export function displayAsciiArt(ascii_art: string) {
    console.log('\x1b[32m%s\x1b[0m', ascii_art);
}
