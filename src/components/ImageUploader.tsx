import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  currentAvatarUrl?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, currentAvatarUrl }) => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);

    try {
      // Gerar um nome de arquivo único
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Fazer o upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        toast.error('Erro ao fazer upload da imagem.');
        setUploading(false);
        return;
      }

      // Obter a URL pública da imagem
      const imageUrl = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath).data.publicUrl;

      // Chamar a função de callback com a URL da imagem
      onUpload(imageUrl);
      toast.success('Foto de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Erro ao fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="avatar"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
        className="hidden"
      />
      <label htmlFor="avatar" className="btn-outline cursor-pointer">
        {uploading ? 'Enviando...' : 'Alterar foto'}
      </label>
      {currentAvatarUrl && (
        <img
          src={currentAvatarUrl}
          alt="Avatar atual"
          className="w-16 h-16 rounded-full object-cover mt-2"
        />
      )}
    </div>
  );
};

export default ImageUploader;
