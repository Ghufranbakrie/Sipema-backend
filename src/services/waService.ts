// waService.ts
import axios from 'axios';
import { ServiceResponse, INTERNAL_SERVER_ERROR_SERVICE_RESPONSE } from '$entities/Service';
import Logger from '$pkg/logger';

export type SendMessageResponse = { success: boolean } | {};

interface SipenaTemplateData {
    nama: string;
    judul: string;
    desc: string;
    date: string;
    status: string;
}

class WaService {
    private apiUrl: string;
    private token: string;

    constructor() {
        this.apiUrl = 'https://graph.facebook.com/v21.0/518032181394389/messages';
        this.token = process.env.WHATSAPP_TOKEN || '';
    }

    public async sendMessage(
        to: string,
        templateData: SipenaTemplateData
    ): Promise<ServiceResponse<SendMessageResponse>> {
        const data = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to,
            type: 'template',
            template: {
                name: 'template_test',
                language: {
                    code: 'en'
                },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: templateData.nama },
                            { type: 'text', text: '#' + Math.random().toString().slice(2, 11) }, // Generate random number
                            { type: 'text', text: templateData.judul },
                            { type: 'text', text: templateData.desc },
                            { type: 'text', text: templateData.date },
                            { type: 'text', text: templateData.status }
                        ]
                    }
                ]
            }
        };

        try {
            const response = await axios.post(this.apiUrl, data, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
            Logger.info('Message sent successfully:', response.data);
            return {
                status: true,
                data: { success: true }
            };
        } catch (error) {
            Logger.error(`whatsAppService.sendMessage: ${error}`);
            return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
    }
}

export default WaService;