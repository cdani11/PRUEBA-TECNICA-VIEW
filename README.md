# Prueba Netby por Carlos Tigrero

Se crea Portal Web Angular bajo cli v19.0.2

## Ejecución

Puedes ejecutar la solucion desde VSCode.

En VSCode se encuentra el archivo ".vscode/launch.json" ya configurado, puedes ir a la opción **RUN AND DEBUG** y seleccionar **ng serve** de la lista desplegable.

## Inicio de sesión

Puedes iniciar sesion con el usuario **ctigrero** y la contraseña **12345**, este usuario se crea al ejecutar el script de base de datos.

Si deseas crear otro usuario, ve a la tabla Usuarios y crealo tu mismo, la contraseña debe estar encriptada, puedes usar el siguiente fragmento de código para encriptar el valor:

```c#
public static string CifrarClave(string dataToEncrypt, string password, string salt)
{
    using (var aes = Aes.Create())
    {
        using (var key = new Rfc2898DeriveBytes(password, Encoding.UTF8.GetBytes(salt), 10000, HashAlgorithmName.SHA256))
        {
            aes.Key = key.GetBytes(32); // AES-256
            aes.IV = key.GetBytes(16);

            using (var encryptor = aes.CreateEncryptor(aes.Key, aes.IV))
            using (var ms = new MemoryStream())
            using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
            {
                byte[] bytes = Encoding.UTF8.GetBytes(dataToEncrypt);
                cs.Write(bytes, 0, bytes.Length);
                cs.FlushFinalBlock();
                return Convert.ToBase64String(ms.ToArray());
            }
        }
    }
}
```

sustituye el parámetro *dataToEncrypt* por el valor a encriptar o contraseña, *password* por "P@ssw0rd!Ex@mple" y *salt* por "s@ltV@lu3Ex@mple!".

Al iniciar sesion se crea un token JWT el cual se comparte en las llamadas a la APIs como forma de autorización.

## ¡IMPORTANTE!

Las APIs, al ser un proyecto .NET se ubico en otro repo, debes ir a descargarlo para que todo funcione, es decir, APIs y Sitio Web.

El enlace al otro repo es: https://github.com/cdani11/SLN.PRUEBA.GYE