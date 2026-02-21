export interface IObjectEndereco {
    enderecoCep: string;
    enderecoEstadoIbge: number;
    enderecoCidadeIbge: number;
    enderecoCidade: string;
    enderecoBairro: string;
    enderecoLogradouro: string;
    enderecoNumero: string;
    enderecoComplemento?: string | null;
}
