
import axios from 'axios';
import { ServiceResponse, INTERNAL_SERVER_ERROR_SERVICE_RESPONSE } from '$entities/Service';
import Logger from '$pkg/logger';
import { PengaduanMasyarakat } from '@prisma/client';
import { PengaduanMasyarakatDTO } from '$entities/PengaduanMasyarakat';
import { getStatusMessage } from '$utils/whatsaapp.utils';

export type SendMessageResponse = { success: boolean } | {};


class WaService {
    private apiUrl: string;
    private token: string;

    constructor() {
        this.apiUrl = 'https://graph.facebook.com/v21.0/498746269997375/messages';
        this.token = process.env.WHATSAPP_TOKEN || '';
    }

    public async sendMessage(
        to: string,
        templateData: PengaduanMasyarakatDTO
    ): Promise<ServiceResponse<SendMessageResponse>> {
        const data = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to,
            type: 'template',
            template: {
                name: 'create_pelporan',
                language: {
                    code: 'id'
                },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: templateData.nama },
                            { type: 'text', text: templateData.id },
                            { type: 'text', text: templateData.judul },
                            { type: 'text', text: templateData.deskripsi },
                            { type: 'text', text: new Date().toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })},
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
        } catch (error: any) {
            console.error('WhatsApp API Error:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                responseData: error.response?.data,
                requestData: data
            });

            return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
    }

    public async sendStatusUpdate(
        to: string,
        templateData: PengaduanMasyarakat
    ): Promise<ServiceResponse<SendMessageResponse>> {
        const data = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to,
            type: 'template',
            template: {
                name: 'update_status',
                language: {
                    code: 'id'
                },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: templateData.nama },
                            { type: 'text', text: templateData.id },
                            { type: 'text', text: getStatusMessage(templateData.status) },
                            { type: 'text', text: templateData.judul },
                            { type: 'text', text: templateData.deskripsi },
                            { type: 'text', text: new Date(templateData.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })},
                            { type: 'text', text: templateData.response || 'Laporan Anda sedang diproses' }
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
            Logger.info('Status update sent successfully:', response.data);
            return {
                status: true,
                data: { success: true }
            };
        } catch (error) {
            Logger.error(`whatsAppService.sendStatusUpdate: ${error}`);
            return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
        }
    }
}

export default WaService;