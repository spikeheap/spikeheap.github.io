---
layout: post
tags: ['post','technology','backup','gpg','linux']
title: "Using GPG to encrypt backups"
date: 2013-09-12 18:39
comments: true
---
If you're doing off-site backups (and if you're not, you should), you've probably wondered how much you trust the place you're uploading to. Fortunately [public-key cryptography](http://en.wikipedia.org/wiki/Public-key_cryptography) is here to help. 

With public-key encryption, you have two keys, a *public* key and a *private* key. The public key can be passed around to anyone you like, published on the Internet, etc. The private key is (unsurprisingly) kept secret. The keys are generated as pairs and are intrinsically linked, so you can do the following:

1. Someone encrypts a message or file using your *public* key. Only the *private* key can decrypt it (which only you have).
2. You sign a message or file using your *private* key. Anyone with your *public* key can verify that the message was written by you and hasn't been altered.

This is commonly used for e-mail, and has a great advantage when you're using it to encrypt files for off-site backup because the private key is always kept private.  If you have many servers they all use the same public key to encrypt their data before uploading to a remote site. The data on that site is encrypted, so an attacker would need your private key to access it. But what about if one of the servers is compromised? Obviously the attacker has access to the live data on that server, but the *public* key stored on the machine doesn't allow decryption, so they are no closer to accessing data anywhere else. This means you don't have to worry about revoking keys or having independent keys for each machine.

[Gnu Privacy Guard](http://www.gnupg.org) (GPG) is an open-source tool for encrypting and signing data using public-key cryptography. It's easy to install, and is included on most modern operating systems. There are also several nice front-ends, for example [GPGTools for OSX](https://gpgtools.org/), which take away the effort of having to use the terminal.

You can generate a key using the following command. Note that a passphrase is a *really* good idea because it gives you that little bit of extra protection: if you lose your private key it's useless without the passphrase. The passphrase is only needed for the private key, so a script can still encrypt the data without human interaction.

```bash
gpg --gen-key
```

Once you've generated your key you can send it to a key server so your other hosts can get at it (XXXXXXXX needs to be replaced with the short ID for your key):

```bash
gpg --keyserver subkeys.pgp.net --send-key XXXXXXXX
```

Then it's a really good idea to take a backup of your key (you can also copy your ~/.gnupg directory somewhere safe):

```bash
gpg --export-secret-keys --armor john@example.com > john-privkey.asc
```

Make sure to keep the resultant file safe, if you lose your private key *or* forget your passphrase then the contents of any encrypted files are lost forever.

On your remote servers the commands you need to download the public key and set it to be trusted:

```bash
gpg --keyserver subkeys.pgp.net --recv-keys XXXXXXXX
gpg --edit XXXXXXX trust # set 5 if you trust it ultimately, and confirm
```

Then you can encrypt a file: 

```bash
gpg --encrypt --recipient XXXXXXXX FILENAME
```

The result is a new file: FILENAME.gpg. Try decrypting it (gpg --decrypt FILENAME). On the remote machine you should see:

```bash
gpg: decryption failed: secret key not available
```

But on the machine you created the keys on it will ask you for your passphrase and voila!

## Signatures

This post hasn't touched on signatures or non-repudiation. Although the above will give you a set of encrypted files, you can't be sure that it was you who encrypted it, after all, your public key is available to anyone. GPG allows messages to be signed, which proves a message or file hasn't been altered since the owner of that key signed it.

For multi-server backups, each server should have its own key pair for signing which *is not* the same as the encryption key. That way if a server is compromised you don't need to worry about the integrity of files sent by the other servers. 