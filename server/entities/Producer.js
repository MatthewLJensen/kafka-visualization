export class Producer {
    constructor(id, createdAt, topic) {
        this.id = id
        this.createdAt = createdAt
        this.topic = topic
        this.lastUpdated = createdAt
        this.produced = 0
    }

    getProduced() {
        return this.produced
    }
    
    updateProduced(produced) {
        this.produced += parseInt(produced)
        if (produced > 0) {
            this.lastUpdated = new Date()
        }
    }
}