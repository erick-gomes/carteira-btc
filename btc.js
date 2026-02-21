import { networks, payments } from 'bitcoinjs-lib'
import bip39 from 'bip39'
import { BIP32Factory } from 'bip32'
import * as ecc from 'tiny-secp256k1'

const bip32 = BIP32Factory(ecc)
const network = networks.testnet

const mnemonic = bip39.generateMnemonic()
const seed = bip39.mnemonicToSeedSync(mnemonic)
const root = bip32.fromSeed(seed, network)

const path = "m/84'/1'/0'/0/0"
const account = root.derivePath(path)

const { address } = payments.p2wpkh({
    pubkey: account.publicKey,
    network,
})
try {
    const response = await fetch(`https://blockstream.info/testnet/api/address/${address}`)
    const data = await response.json()
    const { funded_txo_sum: funded, spent_txo_sum: spent } = data.chain_stats
    const balance = (funded - spent) / 1e8

    console.log(`Mnemonic: ${mnemonic}`)
    console.log(`Address:  ${address}`)
    console.log(`Balance: ${balance}`)
    console.log(`Private Key (WIF): ${account.toWIF()}`)
} catch (error) {
    console.error('Ocorreu um erro:\n' + error)
}



