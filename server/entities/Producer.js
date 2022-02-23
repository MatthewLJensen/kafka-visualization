export class Producer {
    constructor(id, createdAt) {
        this.id = id
        this.createdAt = createdAt
        this.produced = 0
    }

    getProduced() {
        return this.produced
    }
    
    updateProduced(produced) {
        this.produced += parseInt(produced)
    }
}