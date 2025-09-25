
import * as Linking from 'expo-linking';
import { WhatsAppMessage } from '../types';

export const generateWhatsAppMessage = (voucher: WhatsAppMessage): string => {
  const expiryDate = new Date(voucher.expiryDate).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `🎫 *VALE HÉRCULES* 🎫

📋 *Folio:* ${voucher.folio}
👤 *Cliente:* ${voucher.subClientName}
💰 *Monto:* $${voucher.amount.toLocaleString()} pesos
📅 *Válido hasta:* ${expiryDate}

✅ *Instrucciones:*
• Presenta este vale en cualquier sucursal
• Válido por 10 días desde su emisión
• Monto máximo: $5,000 pesos

🏪 *HérculesVale - Sistema Digital*`;
};

export const shareVoucherWhatsApp = async (voucher: WhatsAppMessage, phoneNumber?: string) => {
  try {
    const message = generateWhatsAppMessage(voucher);
    const encodedMessage = encodeURIComponent(message);
    
    let whatsappUrl = `whatsapp://send?text=${encodedMessage}`;
    
    if (phoneNumber) {
      // Remove any non-numeric characters and ensure it starts with country code
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const formattedPhone = cleanPhone.startsWith('52') ? cleanPhone : `52${cleanPhone}`;
      whatsappUrl = `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`;
    }

    const canOpen = await Linking.canOpenURL(whatsappUrl);
    
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
      console.log('WhatsApp opened successfully');
      return true;
    } else {
      // Fallback to web WhatsApp
      const webWhatsAppUrl = phoneNumber 
        ? `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`
        : `https://wa.me/?text=${encodedMessage}`;
      
      await Linking.openURL(webWhatsAppUrl);
      console.log('Web WhatsApp opened successfully');
      return true;
    }
  } catch (error) {
    console.error('Error sharing to WhatsApp:', error);
    return false;
  }
};
